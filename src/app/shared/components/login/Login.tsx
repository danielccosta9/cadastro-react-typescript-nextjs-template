import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts";
import { useEffect, useState } from "react";
import * as yup from 'yup';

const loginSchema = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().required('Senha obrigatória').min(6)
});

interface ILoginProps {
    children: React.ReactNode;
}

export const Login: React.FC<ILoginProps> = ({ children }) => {
    const { isAuthenticaded, login } = useAuthContext();
    const [isLogin, setIsLogin] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    if (isAuthenticaded) {
        return (
            <>
                {children}
            </>
        )
    }

    const handleSubmit = () => {
        setIsLogin(true);
        loginSchema
            .validate({ email, password }, { abortEarly: false })
            .then((dadosValidados) => {
                login(dadosValidados.email, dadosValidados.password)
                    .then(() => {
                        setIsLogin(false);
                    });
            })
            .catch((errors: yup.ValidationError) => {
                setIsLogin(false);
                errors.inner.forEach((error) => {
                    if (error.path === 'email') {
                        setEmailError(error.message);
                    }
                    if (error.path === 'password') {
                        setPasswordError(error.message);
                    }
                });
            });
    }


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw'
            }}
        >
            <Card>
                <CardContent>
                    <Box width={350} display='flex' flexDirection='column' gap={2}>
                        <Typography variant="h6" align="center">
                            Informe suas credenciais
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            type="email"
                            fullWidth
                            value={email}
                            error={!!emailError}
                            helperText={emailError}
                            onKeyDown={() => setEmailError('')}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLogin}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Senha"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={password}
                            error={!!passwordError}
                            helperText={passwordError}
                            onKeyDown={() => setPasswordError('')}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLogin}
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Box width="100%" display='flex' justifyContent='center'>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLogin}
                            endIcon={isLogin ? <CircularProgress size={20} variant="indeterminate" color="inherit" /> : undefined}
                        >
                            Entrar
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </Box>
    );
}