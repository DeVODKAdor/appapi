import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Typography,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Inicio() {
  const [object, setObject] = useState("people");
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchAllData = async (url) => {
    try {
      const res = await axios.get(url);
      const results = res.data.results;
      setData(results);

      if (results.length > 0) {
        setHeaders(Object.keys(results[0]));
      }

      // Fetch additional data for URLs and lists of URLs
      const updatedResults = await Promise.all(
        results.map(async (item) => {
          const newItem = { ...item };
          for (const key in item) {
            if (item[key]) {
              if (Array.isArray(item[key])) {
                // Handle arrays of URLs
                const urlPromises = item[key].map(async (url) => {
                  if (url.includes("https://swapi.dev/api/")) {
                    try {
                      const urlRes = await axios.get(url);
                      return urlRes.data.name || urlRes.data.title || url;
                    } catch (error) {
                      console.error(`Error fetching data for ${url}`, error);
                      return url;
                    }
                  }
                  return url;
                });
                newItem[key] = await Promise.all(urlPromises);
              } else if (item[key].includes("https://swapi.dev/api/")) {
                // Handle single URL
                try {
                  const urlRes = await axios.get(item[key]);
                  newItem[key] = urlRes.data.name || urlRes.data.title || item[key];
                } catch (error) {
                  console.error(`Error fetching data for ${item[key]}`, error);
                }
              }
            }
          }
          return newItem;
        })
      );

      setData(updatedResults);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllData(`https://swapi.dev/api/${object}`);
  }, [object]);

  return (
    <section className="m-16 text-center">
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Bem-vindo ao display de informação de Star Wars. Selecione o que deseja obter informações sobre:
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Objeto</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={object}
            label="Objeto"
            onChange={(event: SelectChangeEvent) => {
              setObject(event.target.value as string);
            }}
          >
            <MenuItem value={"species"}>Espécie</MenuItem>
            <MenuItem value={"films"}>Filme</MenuItem>
            <MenuItem value={"starships"}>Nave</MenuItem>
            <MenuItem value={"people"}>Pessoa</MenuItem>
            <MenuItem value={"planets"}>Planeta</MenuItem>
            <MenuItem value={"vehicles"}>Veículo</MenuItem>
          </Select>
        </FormControl>
        <TableContainer component={Paper} sx={{ marginTop: 4, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1000 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header} sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                      {Array.isArray(row[header])
                        ? row[header].join(", ")
                        : row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchAllData(prevPage)}
            disabled={!prevPage}
          >
            Página Anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchAllData(nextPage)}
            disabled={!nextPage}
          >
            Próxima Página
          </Button>
        </Box>
      </Container>
    </section>
  );
}
