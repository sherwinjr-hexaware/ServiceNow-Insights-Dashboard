import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { supabase } from 'lib/supabase';
import { TextField, Button, Box, Typography, Paper, Link, Alert } from '@mui/material';
import paths from 'routes/paths';
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {

      setStatus({ type: 'error', msg: error.message });
    } else {
      setStatus({ type: 'success', msg: 'Check your email for a verification link!' });

    }

  };

  return (
<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
<Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
<Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Create Account
</Typography>

        {status.msg && <Alert severity={status.type as any} sx={{ mb: 2 }}>{status.msg}</Alert>}
<form onSubmit={handleSignup}>
<TextField
            fullWidth label="Email" margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            required/>
<TextField fullWidth label="Password" type="password" margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            required/>
<Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
            Register
</Button>

</form>

<Box sx={{ mt: 2, textAlign: 'center' }}>
<Link component={RouterLink} to={paths.login} variant="body2">
            Already have an account? Login
</Link>
</Box>
</Paper>
</Box>

  );

}
 