<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class QrCodeController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'id' => 'required|string',
            'fullname' => 'required|string',
        ]);

        $data = [
            'id' => $request->id,
            'fullname' => $request->fullname,
            'generated_at' => now()->toIso8601String(),
        ];

        $jsonData = json_encode($data);

        // Tạo mã QR
        $qrImage = QrCode::format('png')
            ->size(300)
            ->generate($jsonData);

        // Tên file QR
        $filename = 'qrcodes/' . $request->employee_code . '_' . now()->format('Ymd_His') . '.png';

        // Lưu file vào storage/app/public/qrcodes
        Storage::disk('public')->put($filename, $qrImage);

        // Trả về URL công khai
        return response()->json([
            'message' => 'QR code created successfully',
            'qr_data' => $data,
            'qr_url' => asset('storage/' . $filename),
        ]);
    }
}
