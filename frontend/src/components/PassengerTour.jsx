import { useState, useEffect } from 'react';
import * as JoyrideModule from 'react-joyride';
const Joyride = JoyrideModule.default;
const { STATUS } = JoyrideModule;

const steps = [
  {
    target: '.tour-welcome',
    content: 'Welcome to SafariPass! This is your dashboard, here you can see your subscription at a glance.',
    disableBeacon: true,
  },
  {
    target: '.tour-qr',
    content: 'Once subscribed, your QR pass lives here. Just show it to the conductor when boarding.',
  },
  {
    target: '.tour-shift',
    content: 'Need to take a different route temporarily? Use Route Shift, up to 3 times per subscription.',
  },
  {
    target: '.tour-payments',
    content: 'All your past M-Pesa payments are tracked here.',
  },
  {
    target: '.tour-profile',
    content: 'Manage your account details and password from your Profile.',
  },
];

function PassengerTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('safaripass_tour_seen');
    if (!seen) {
      const timer = setTimeout(() => setRun(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCallback = (data) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem('safaripass_tour_seen', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: '#0F2A43',
          zIndex: 10000,
        },
      }}
    />
  );
}

export default PassengerTour;