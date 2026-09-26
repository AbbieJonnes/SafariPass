const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  setSlowNotice(false);

  const slowTimer = setTimeout(() => setSlowNotice(true), 4000);

  try {
    await axiosInstance.post('/accounts/register/', {
      ...formData,
      role: 'passenger',
    });
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
  } catch (err) {
    setError('Registration failed. Username or email may already be taken.');
  } finally {
    clearTimeout(slowTimer);
    setLoading(false);
    setSlowNotice(false);
  }
};