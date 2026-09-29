import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faLocationDot, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function BrowseRoutes() {
  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [fares, setFares] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentPending, setPaymentPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/companies/')
      .then((res) => setCompanies(res.data))
      .catch(() => setError('Could not load companies.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setLoading(true);
    axiosInstance.get('/companies/routes/')
      .then((res) => {
        const filtered = res.data.filter((r) => r.company === company.id);
        setRoutes(filtered);
        setStep(2);
      })
      .catch(() => setError('Could not load routes.'))
      .finally(() => setLoading(false));
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setLoading(true);
    Promise.all([
      axiosInstance.get('/companies/plan-types/'),
      axiosInstance.get('/companies/fares/'),
    ])
      .then(([plansRes, faresRes]) => {
        setPlanTypes(plansRes.data);
        setFares(faresRes.data);
        setStep(3);
      })
      .catch(() => setError('Could not load plan types.'))
      .finally(() => setLoading(false));
  };

  const currentFare = selectedRoute
    ? fares.find((f) => f.route === selectedRoute.id && !f.effective_to)
    : null;
  const basePrice = currentFare ? parseFloat(currentFare.price) : 0;
  const estimatedPrice = selectedPlan
    ? (basePrice * parseFloat(selectedPlan.price_multiplier)).toFixed(2)
    : null;

  const handleSubscribe = () => {
    setSubscribing(true);
    setError('');

    axiosInstance.post('/subscriptions/', {
      route: selectedRoute.id,
      plan_type: selectedPlan.id,
    })
      .then((res) => {
        const subscriptionId = res.data.id;
        setPaymentPending(true);
        return axiosInstance.post('/payments/mpesa/initiate/', {
          subscription: subscriptionId,
          phone_number: phoneNumber,
        });
      })
      .then(() => {
        setError('');
        alert('Check your phone to complete the M-Pesa payment (Lipa Na M-Pesa prompt).');
        navigate('/passenger/dashboard');
      })
      .catch(() => setError('Subscription or payment failed. Please try again.'))
      .finally(() => {
        setSubscribing(false);
        setPaymentPending(false);
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Browse Routes</h1>
        <p className="text-gray-500 mb-8">Pick a company, then a route, then a plan.</p>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`w-10 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl mb-2" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleSelectCompany(company)}
                    className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left flex items-center gap-4"
                  >
                    <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faBuilding} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-textdark">{company.name}</h3>
                      <p className="text-sm text-gray-500">{company.contact_email}</p>
                    </div>
                  </button>
                ))}
                {companies.length === 0 && (
                  <p className="text-gray-400 col-span-2 text-center py-8">No companies available yet.</p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {routes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => handleSelectRoute(route)}
                    className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left flex items-center gap-4"
                  >
                    <div className="bg-secondary w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faLocationDot} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-textdark">
                        {route.origin} <FontAwesomeIcon icon={faArrowRight} className="text-xs mx-1 text-gray-400" /> {route.destination}
                      </h3>
                    </div>
                  </button>
                ))}
                {routes.length === 0 && (
                  <p className="text-gray-400 col-span-2 text-center py-8">No routes available for this company yet.</p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {planTypes.map((plan) => {
                    const planPrice = (basePrice * parseFloat(plan.price_multiplier)).toFixed(2);
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left border-2 ${
                          selectedPlan?.id === plan.id ? 'border-secondary bg-secondary/5' : 'border-transparent bg-card'
                        }`}
                      >
                        <h3 className="font-semibold text-textdark capitalize mb-1">
                          {plan.plan_category.replace('_', ' ')} — {plan.duration}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {plan.plan_category === 'peak'
                            ? `Valid ${plan.peak_start_time || '—'} to ${plan.peak_end_time || '—'}`
                            : 'Valid anytime, all day'}
                        </p>
                        <p className="text-lg font-bold text-primary">KES {planPrice}</p>
                      </button>
                    );
                  })}
                </div>

                {selectedPlan && (
                  <div className="bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-textdark">Amount to pay</span>
                    <span className="text-xl font-bold text-primary">KES {estimatedPrice}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-textdark mb-1">M-Pesa Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="2547XXXXXXXX"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={!selectedPlan || subscribing}
                  className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 mt-4"
                >
                  {subscribing ? 'Subscribing...' : `Confirm & Pay KES ${estimatedPrice || ''}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BrowseRoutes;