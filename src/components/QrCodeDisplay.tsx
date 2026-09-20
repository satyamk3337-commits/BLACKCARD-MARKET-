import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrMode } from '../types';
import { QrCode, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface QrCodeDisplayProps {
  upiId: string;
  payeeName: string;
  amount: number;
  note?: string;
  qrMode: QrMode;
  customQrImageUrl?: string;
  size?: number;
  className?: string;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  upiId,
  payeeName,
  amount,
  note = 'BCM-PAYMENT',
  qrMode,
  customQrImageUrl,
  size = 200,
  className = '',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [genError, setGenError] = useState<string>('');

  // Standard UPI URI format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    if (qrMode === 'custom_image' && customQrImageUrl) {
      setDataUrl(customQrImageUrl);
      setGenError('');
      return;
    }

    // Generate dynamic QR
    QRCode.toDataURL(upiUri, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#05070e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setDataUrl(url);
        setGenError('');
      })
      .catch((err) => {
        console.error('Failed to generate QR', err);
        setGenError('Unable to generate dynamic QR. Use manual UPI transfer.');
      });
  }, [upiUri, qrMode, customQrImageUrl, size]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative p-2.5 bg-white rounded-2xl shadow-xl shadow-purple-950/30 border-2 border-purple-500/30 group">
        {dataUrl ? (
          <div className="relative">
            <img
              src={dataUrl}
              alt="UPI QR Code"
              style={{ width: `${size}px`, height: `${size}px` }}
              className="object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
            {qrMode === 'auto_upi' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-[10px] font-black text-purple-700">
                  ₹
                </div>
              </div>
            )}
          </div>
        ) : genError ? (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex flex-col items-center justify-center p-3 text-center text-red-500 text-xs bg-slate-100 rounded-xl"
          >
            <AlertCircle className="w-6 h-6 mb-1" />
            <span>{genError}</span>
          </div>
        ) : (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex flex-col items-center justify-center bg-slate-100 rounded-xl animate-pulse text-slate-400 text-xs"
          >
            <QrCode className="w-8 h-8 mb-1 animate-spin text-purple-600" />
            <span>Rendering UPI QR...</span>
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950/70 border border-purple-800/80 text-purple-300">
          {qrMode === 'custom_image' ? (
            <>
              <ImageIcon className="w-3 h-3 text-amber-400" /> Admin Custom QR Code
            </>
          ) : (
            <>
              <QrCode className="w-3 h-3 text-emerald-400" /> Dynamic Auto-UPI (₹{amount.toLocaleString('en-IN')})
            </>
          )}
        </span>
      </div>
    </div>
  );
};
