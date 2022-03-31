import {
    Typography,
    Link, 
} from '@material-ui/core'

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit">
            Colloquium
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        </Typography>
    );
};

export default Copyright
