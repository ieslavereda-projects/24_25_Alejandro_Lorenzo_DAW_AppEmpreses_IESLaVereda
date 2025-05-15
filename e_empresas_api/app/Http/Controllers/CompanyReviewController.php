<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\CompanyReview;

class CompanyReviewController extends Controller
{
    public function store(Request $request, Company $company)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'comment'           => 'required|string',
            'rating'            => 'required|integer|min:1|max:5',
            'work_environment'  => 'required|integer|min:1|max:5',
            'mentoring'         => 'required|integer|min:1|max:5',
            'learning_value'    => 'required|integer|min:1|max:5',
            'would_recommend'   => 'required|boolean',
            'id_student'        => 'nullable|exists:users,id',
        ]);

        try {
            $studentId = $request->id_student;

            $review = $company->reviews()->firstOrNew([
                'id_student' => $studentId,
            ]);

            $review->fill($validated);
            $review->id_student = $studentId;
            $review->save();

            return response()->json($review, 201);
        } catch (\Exception $e) {
            Log::error("Error al crear o actualizar review para Company ID={$company->id}: " . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Error interno al guardar el comentario.',
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
