import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faQrcode } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function ScanPass() {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (scannerRef.current) scannerRef.current.stop().catch(() => {});
    };
  }, []);

  const startScan = () => {
    setResult(null);
    setError('');
    setScanning(true);

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        scanner.stop().then(() => setScanning(false));
        submitScan(decodedText);
      },
      () => {}
    ).catch(() => {
      setError('Could not access camera. Please allow camera permissions.');
      setScanning(false);
    });
  };

  const submitScan = (qrToken) => {
    axiosInstance.post('/payments/validations/', { qr_token: qrToken })
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.response?.data?.qr_token?.[0] || 'Could not validate this pass.'));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Scan Pass</h1>
        <p className="text-gray-500 mb-6">Scan a passenger's QR code to validate their subscription.</p>

        <div id="qr-reader" className="rounded-2xl overflow-hidden bg-black mb-6" style={{ minHeight: scanning ? '300px' : '0' }}></div>

        {!scanning && (
          <button onClick={startScan}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faQrcode} /> Start Scanning
          </button>
        )}

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mt-4">{error}</div>}

        {result && (
          <div className={`rounded-2xl p-6 mt-4 ${result.result === 'active' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <FontAwesomeIcon icon={result.result === 'active' ? faCircleCheck : faCircleXmark}
                className={`text-3xl ${result.result === 'active' ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className={`text-xl font-bold capitalize ${result.result === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                {result.result}
              </h3>
            </div>
            <p className="text-sm text-textdark"><strong>Passenger:</strong> {result.passenger_username}</p>
            <p className="text-sm text-textdark"><strong>Route:</strong> {result.route}</p>
            <p className="text-sm text-textdark"><strong>Plan:</strong> {result.plan_type}</p>

            <button onClick={startScan}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition mt-4">
              Scan Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScanPass;