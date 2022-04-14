import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../components/Copyright";
import { useAuthViewStyles } from "../styles/authViewStyles";
import { useAuth } from "../useAuth";
import ErrorMessage from "../components/ErrorMessage.js";

const LoginView = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const classes = useAuthViewStyles();
    const auth = useAuth();
    const history = useHistory()
    const { state } = useLocation()

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.login(email, password);
    };

    useEffect(() => {
        if (auth.user) 
            history.push(state?.path || "/papers")
    }, [auth.user]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Colloquium Sign in
                </Typography>
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                    {auth.error && <ErrorMessage message={auth.error} />}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={email === "" || password === ""}
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" underline="hover">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="signup" variant="body2" underline="hover">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
};

export default LoginView;
