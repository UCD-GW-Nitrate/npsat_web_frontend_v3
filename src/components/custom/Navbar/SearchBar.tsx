import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: alpha(theme.palette.secondary.main, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.25),
  },
  marginLeft: 0,
  height: '40px',
  width: 'fit-content',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'fit-content',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '28ch',
      },
    },
  },
}));

const SearchBar = () => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  );
};

export default SearchBar;
