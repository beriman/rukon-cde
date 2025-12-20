/**
 * QR Code Generator Component
 * Story 7.3: Mobile App - QR Scanning
 * 
 * Generates QR codes for assets/rooms with PDF export
 */
import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
    type: 'asset' | 'room';
    id: string;
    name: string;
    code?: string;
    projectName?: string;
    size?: number;
    onClose?: () => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
    type,
    id,
    name,
    code,
    projectName,
    size = 200,
    onClose,
}) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    // Generate the QR code value
    const qrValue = `rukon://${type}/${id}`;

    // Export to PDF
    const handleExportPdf = async () => {
        setIsExporting(true);

        try {
            // Create a printable window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups to export PDF');
                return;
            }

            // Get QR code SVG
            const svgElement = qrRef.current?.querySelector('svg');
            const svgData = svgElement?.outerHTML || '';

            // Create print document
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code - ${name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              text-align: center;
            }
            .qr-container {
              display: inline-block;
              padding: 30px;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              background: white;
            }
            .qr-code {
              margin-bottom: 20px;
            }
            .qr-code svg {
              width: 200px;
              height: 200px;
            }
            .info {
              text-align: center;
            }
            .type-badge {
              display: inline-block;
              padding: 4px 12px;
              background: ${type === 'asset' ? '#3b82f6' : '#22c55e'};
              color: white;
              border-radius: 9999px;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .name {
              font-size: 18px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 4px;
            }
            .code {
              font-size: 14px;
              color: #6b7280;
              font-family: monospace;
              margin-bottom: 4px;
            }
            .project {
              font-size: 12px;
              color: #9ca3af;
            }
            .instructions {
              margin-top: 20px;
              font-size: 11px;
              color: #9ca3af;
            }
            @media print {
              body { padding: 20px; }
              .qr-container { border: 1px solid #ccc; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-code">
              ${svgData}
            </div>
            <div class="info">
              <div class="type-badge">${type}</div>
              <div class="name">${name}</div>
              ${code ? `<div class="code">${code}</div>` : ''}
              ${projectName ? `<div class="project">${projectName}</div>` : ''}
            </div>
            <div class="instructions">
              Scan with Rukon Mobile App
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
            printWindow.document.close();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export QR code');
        } finally {
            setIsExporting(false);
        }
    };

    // Copy QR value to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(qrValue);
            alert('QR code value copied!');
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* QR Code */}
            <div
                ref={qrRef}
                className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center mb-4"
            >
                <QRCode
                    value={qrValue}
                    size={size}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                />
            </div>

            {/* Info */}
            <div className="text-center mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-2 ${type === 'asset' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                    {type.toUpperCase()}
                </span>
                <h4 className="font-semibold text-gray-900">{name}</h4>
                {code && (
                    <p className="text-sm text-gray-500 font-mono">{code}</p>
                )}
                {projectName && (
                    <p className="text-xs text-gray-400 mt-1">{projectName}</p>
                )}
            </div>

            {/* QR Value */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">QR Value:</p>
                <p className="text-sm font-mono text-gray-700 break-all">{qrValue}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                    📋 Copy
                </button>
                <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                >
                    {isExporting ? 'Exporting...' : '🖨️ Print'}
                </button>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
