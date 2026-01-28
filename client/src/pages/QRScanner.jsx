import React, { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import api from '../api'
import toast from 'react-hot-toast'
import { API_URL } from '../config'

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText, decodedResult) {
            // Check if already processing a scan to avoid multiple hits
            // Note: Html5QrcodeScanner might keep scanning, so we need to lock or stop it.
            // For now, we just update state and maybe clear scanner if we want to stop.
            if (!scanResult) {
                setScanResult(decodedText);
                handleAttendance(decodedText);
                scanner.clear(); // Stop scanning after success
            }
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(error => {
                // Failed to clear scanner.
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, []);

    const handleAttendance = async (code) => {
        setLoading(true)
        try {
            // Assuming the QR code contains a specific string or just validation for now
            // In a real app, the QR might contain a signed token or event ID.
            // For this 'daily attendance', we just need to hit the endpoint.
            // We can send the scanned code to verify it's a valid GFG QR code if we want.
            // For simplicity, just hitting the endpoint is enough as per current backend logic,
            // but let's assume we send the code to be safe.

            const res = await api.post('/api/attendance', { method: 'qr', code: code })
            toast.success(`Attendance Marked! +${res.data.pointsAdded} Points`)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error marking attendance')
            // If failed (e.g. already attended), let them scan again?
            // setScanResult(null); // Uncomment to allow retry immediately, but scanner is cleared.
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Scan QR Code</h2>

            {!scanResult ? (
                <div id="reader" className="w-full"></div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-lg font-medium text-gray-700">Code Scanned!</p>
                    <p className="text-sm text-gray-500 break-all mt-2">{scanResult}</p>
                    {loading && <p className="text-blue-500 mt-4">Verifying...</p>}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        Scan Again
                    </button>
                </div>
            )}
        </div>
    )
}

export default QRScanner
