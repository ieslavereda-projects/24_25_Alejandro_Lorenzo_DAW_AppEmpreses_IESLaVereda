<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\CompanyReview;
use Illuminate\Database\QueryException;

class CompanyReviewController extends Controller
{
    public function allReviews(Request $request)
    {
        $reviews = CompanyReview::with(['company', 'user'])
            ->where('approved', 0)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($reviews);
    }

    public function approve($id)
    {
        $review = CompanyReview::findOrFail($id);
        $review->approved = true;
        $review->save();

        return response()->json($review);
    }

    public function store(Request $request, Company $company)
    {
        $validated = $request->validate([
            'comment'           => 'required|string',
            'rating'            => 'required|integer|min:1|max:5',
            'would_recommend'   => 'required|boolean',
            'id_student'        => 'nullable|exists:users,id',
        ]);
        $validated['approved'] = false;

        try {
            $studentId = $request->id_student;

            $review = $company->reviews()->firstOrNew([
                'id_student' => $studentId,
            ]);

            $review->fill($validated);
            $review->id_student = $studentId;
            $review->save();

            return response()->json($review, 201);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) {
                return response()->json([
                    'message' => 'Solo puedes añadir un comentario en una empresa.'
                ], 409);
            }
        } catch (\Exception $e) {
            Log::error("Error al crear o actualizar review para Company ID={$company->id}: " . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => $e->getMessage(),
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function index(Company $company)
    {
        return response()->json(
            $company->reviews()->with('student')->latest()->get()
        );
    }

    public function destroy(Company $company, CompanyReview $review)
    {
        if ($review->id_company !== $company->id) {
            return response()->json(['message' => 'Review no encontrada'], 404);
        }
        $review->delete();
        return response()->json(null, 204);
    }
}
