<?php

namespace App\Imports;

use App\Models\Company;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Facades\Log;

class CompaniesImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        $rows = $rows->skip(2);

        $groups = $rows->groupBy(function ($row) {
            return mb_strtolower(trim($row[14] ?? ''));
        });

        Log::info("Grupos detectados: " . $groups->count());

        foreach ($groups as $key => $group) {
            $firstIndex = $group->keys()->first() + 3; 

            $name = trim($group->first()[14] ?? '');
            if (!$name) {
                Log::warning("Fila $firstIndex: nombre vacío, se ignora grupo.");
                continue;
            }

            $industries = $group->pluck(value: 41)    
                ->map(fn($v) => trim($v))        
                ->filter()                      
                ->unique()                       
                ->values()                       
                ->toArray();

            $industryCombined = implode(', ', $industries);

            // 5) Preparar datos
            $firstRow = $group->first();
            $data = [
                'manager'        => trim(($firstRow[23] ?? '') . ' ' . ($firstRow[24] ?? '') . ' ' . ($firstRow[25] ?? '')),
                'phone'          => trim($firstRow[18] ?? ''),
                'email'          => filter_var(trim($firstRow[19] ?? ''), FILTER_VALIDATE_EMAIL) ?: null,
                'address'        => trim($firstRow[15] ?? ''),
                'website'        => '',
                'industry'       => $industryCombined,
                'observations'   => '',
                'allows_erasmus' => strtoupper(trim($firstRow[49] ?? '')) === 'N' ? 0 : 1,
                'is_private'     => is_numeric($firstRow[20] ?? null) ? (int) $firstRow[20] : 0,
            ];

            Log::info("Fila $firstIndex: importando empresa \"$name\" con industries: " . $industryCombined, $data);

            Company::updateOrCreate(
                ['name' => $name],
                $data
            );
        }

        Log::info("Importación completada.");
    }
}
