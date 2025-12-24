import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Milk, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; mobile?: string }>({});
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateEmail = (email: string) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: { email?: string; mobile?: string } = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }
    if (mode === 'signup' && !validateMobile(mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits.';
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/');
      } else if (mode === 'signup') {
        await signUp(email, password, name, mobile);
        navigate('/');
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'forgot') return resetSent ? 'Check your email' : 'Reset password';
    return mode === 'login' ? 'Welcome back!' : 'Create account';
  };

  const getDescription = () => {
    if (mode === 'forgot') {
      return resetSent 
        ? "We've sent a password reset link to your email address."
        : 'Enter your email and we\'ll send you a reset link.';
    }
    return mode === 'login'
      ? 'Sign in to access your account and order fresh dairy products.'
      : 'Join us for the freshest dairy products delivered to your door.';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={mode}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-fresh-green-light flex items-center justify-center shadow-medium">
              <Milk className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">KHAIRAWANG</h1>
              <p className="text-xs text-muted-foreground -mt-1">DAIRY</p>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {getTitle()}
          </h2>
          <p className="text-muted-foreground mb-8">
            {getDescription()}
          </p>

          {mode === 'forgot' && resetSent ? (
            <div className="space-y-4">
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => {
                  setMode('login');
                  setResetSent(false);
                }}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="relative">
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter your 10 digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="pl-3"
                        required
                        maxLength={10}
                        minLength={10}
                        pattern="\d{10}"
                      />
                    </div>
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <Button 
                    type="button"
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={() => setMode('forgot')}
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading 
                  ? 'Please wait...' 
                  : mode === 'login' 
                    ? 'Sign In' 
                    : mode === 'signup' 
                      ? 'Create Account'
                      : 'Send Reset Link'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {mode !== 'forgot' && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={async () => {
                      setGoogleLoading(true);
                      try {
                        await signInWithGoogle();
                      } catch (error) {
                        // Error handled in AuthContext
                      } finally {
                        setGoogleLoading(false);
                      }
                    }}
                    disabled={googleLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {googleLoading ? 'Please wait...' : 'Continue with Google'}
                  </Button>
                </>
              )}
            </form>
          )}

          <div className="mt-6 text-center">
            {mode === 'forgot' && !resetSent ? (
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setMode('login')}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Button>
            ) : mode !== 'forgot' && (
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <Button
                  variant="link"
                  className="ml-1 p-0 h-auto"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-fresh-green-dark/90" />
        <img
          src="https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=1200&h=1600&fit=crop"
          alt="Fresh dairy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-fresh-green-dark/80" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground">
            <h3 className="font-display text-4xl font-bold mb-4">
              Farm Fresh Dairy
            </h3>
            <p className="text-lg text-primary-foreground/90 max-w-md">
              Experience the authentic taste of traditional dairy products from 
              the pristine hills of Uttarakhand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
