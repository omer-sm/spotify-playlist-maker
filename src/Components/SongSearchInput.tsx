import * as React from 'react';
import Input, { InputProps } from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import { searchForSong } from '../spotifyManager';
import { ISearchResult } from '../spotifyManager';

type DebounceProps = {
  handleDebounce: (value: string) => void;
  debounceTimeout: number;
};

function DebounceInput(props: InputProps & DebounceProps) {
  const { handleDebounce, debounceTimeout, ...rest } = props;

  const timerRef = React.useRef<number>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return <Input {...rest} onChange={handleChange} />;
}

export default function SongSearchInput({setResults}: {setResults: Function}) {
  const [debouncedValue, setDebouncedValue] = React.useState('');
  const handleDebounce = (value: string) => {
    setDebouncedValue(value);
  };
  React.useEffect(() => {
    if (debouncedValue.length > 1){
      searchForSong(debouncedValue).then(r => {
        setResults(r)
      })
    }
  }, [debouncedValue])
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <DebounceInput
        placeholder="Search song.."
        debounceTimeout={800}
        handleDebounce={handleDebounce}
      />
      <Typography>Debounced input: {debouncedValue}</Typography>
    </Box>
  );
}