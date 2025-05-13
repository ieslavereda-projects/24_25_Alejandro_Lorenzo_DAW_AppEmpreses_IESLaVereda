<?php

namespace App\Imports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TutorsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        try {
            $name = isset($row['nombre']) && !empty($row['nombre']) ? $row['nombre'] . ' ' . $row['primer_apellido'] . ' ' . $row['segundo_apellido'] : 'Desconocido';
            $email = isset($row['correo_electronico']) && !empty($row['correo_electronico']) ? $row['correo_electronico'] : strtolower(str_replace(' ', '', $name)) . '@default.com';
            $studyCycle = isset($row['departamento']) && !empty($row['departamento']) ? $row['departamento'] : 'No asignado';
            $nif = isset($row['nif']) && !empty($row['nif']) ? $row['nif'] : null;
            $password = isset($row['telefono']) && !empty($row['telefono']) ? $row['telefono'] : '1234';

            $user = User::where('email', $email)->first();

            if ($user) {
                $user->nif = $nif;
                $user->name = $name;
                $user->study_cycle = $studyCycle;
                $user->password = $password;
                $user->is_tutor = true; 
                $user->save();
            } else {
                User::create([
                    'nif' => $nif,
                    'name' => $name,
                    'password' => $password,
                    'email' => $email,
                    'study_cycle' => $studyCycle,
                    'is_tutor' => true,
                ]);
            }

            return null; 

        } catch (\Exception $e) {
            \Log::error("Error durante la importación de un usuario: " . $e->getMessage());
            return null;
        }
    }



}
