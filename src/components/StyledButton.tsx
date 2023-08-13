import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  // '&.MuiButton-text': {
  //   color: theme.palette.primary.main,
  // },
  // '&.MuiButton-textPrimary': {
  //   color: theme.palette.primary.main,
  // }
}));

export default StyledButton;
