<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Facades\Log;

class TutorsImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        $rows = $rows->skip(2);

        $groups = $rows->groupBy(fn($row) => trim($row[27] ?? ''));

        Log::info("Tutores únicos detectados: " . count($groups));

        foreach ($groups as $key => $group) {
            $firstIndex = $group->keys()->first() + 3;
            $nifTutor = trim($group->first()[27] ?? '');

            if (!$nifTutor) {
                Log::warning("Fila $firstIndex: NIF de tutor vacío, se ignora grupo.");
                continue;
            }

            $row = $group->first();
            $name = trim(($row[28] ?? '') . ' ' . ($row[29] ?? '') . ' ' . ($row[30] ?? ''));
            $phone = trim($row[31] ?? '');
            $email = filter_var(trim($row[32] ?? ''), FILTER_VALIDATE_EMAIL) ?: null;
            $department = trim($row[33] ?? '');

            $data = [
                'name'        => $name ?: 'Desconocido',
                'nif'         => $nifTutor,
                'email'       => $email ?: strtolower(str_replace(' ', '', $name)) . '@default.com',
                'study_cycle' => $department ?: 'No asignado',
                'password'    => bcrypt($phone ?: '1234'),
                'is_tutor'    => true,
            ];

            Log::info("Fila $firstIndex: importando tutor NIF={$nifTutor}", $data);

            User::updateOrCreate(
                ['nif' => $nifTutor],
                $data
            );
        }

        Log::info("Importación de tutores completada.");
    }
}
