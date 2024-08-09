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
  TextField
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Inicio() {
  const [object, setObject] = useState<string>("people");
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async (url: string) => {
    try {
      const res = await axios.get(url);
      const results = res.data.results;

      const updatedResults = await Promise.all(
        results.map(async (item: any) => {
          const newItem = { ...item };
          for (const key in item) {
            if (item[key]) {
              if (Array.isArray(item[key])) {
                const urlPromises = item[key].map(async (url: string) => {
                  if (typeof url === 'string' && url.includes("https://swapi.dev/api/")) {
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
              } else if (typeof item[key] === 'string' && item[key].includes("https://swapi.dev/api/")) {
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
      setFilteredData(updatedResults);

      if (results.length > 0) {
        setHeaders(Object.keys(results[0]));
      }

      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao carregar os dados. Por favor, tente novamente.");
    }
  };

  useEffect(() => {
    fetchData(`https://swapi.dev/api/${object}`);
  }, [object]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((item) =>
          headers.some((header) =>
            typeof item[header] === 'string' &&
            item[header]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }
  }, [searchTerm, data, headers]);

  return (
    <section className="m-16 text-center" style={{
      background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
      minHeight: "100vh",
      color: "white",
      padding: "40px 20px",
      fontFamily: "'Roboto', sans-serif"
    }}>
      <Container maxWidth="md" sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: 4, borderRadius: 2, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)" }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", letterSpacing: 1.5 }}>
          Bem-vindo ao display de informação de Star Wars
        </Typography>
        <Typography variant="h5" component="p" align="center" gutterBottom sx={{ marginBottom: 4, fontWeight: "300" }}>
          Selecione o que deseja obter informações sobre:
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: 3 }}>
          <InputLabel id="demo-simple-select-label" style={{color: "white"}}>Objeto</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={object}
            label="Objeto"
            onChange={(event: SelectChangeEvent) => {
              setObject(event.target.value as string);
              setSearchTerm("");  // Clear search term when object changes
            }}
            sx={{
              color: "white",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              ".MuiSvgIcon-root": { color: "white" }
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
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Procure pelo nome ou outro termo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            marginBottom: 3,
            input: { color: "white" },
            ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            "& .MuiInputBase-root": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
        />
        {error && (
          <Typography variant="body1" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <TableContainer component={Paper} sx={{
          marginTop: 4,
          overflowX: 'auto',
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
          width: object === "films" ? "100%" : "auto",
          maxWidth: object === "films" ? "100%" : "auto"
        }}>
          <Table sx={{ minWidth: object === "films" ? 1200 : 650 }}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', color: "#2b5876", borderBottom: "2px solid #4e4376" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex} sx={{ "&:hover": { backgroundColor: "rgba(75, 75, 75, 0.1)" } }}>
                  {headers.map((header) => (
                    <TableCell key={header} sx={{ whiteSpace: 'normal', wordWrap: 'break-word', color: "#2b5876" }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              backgroundColor: "#ff4081",
              color: "white",
              "&:hover": {
                backgroundColor: "#f50057"
              },
              marginX: 2
            }}
            onClick={() => fetchData(`https://swapi.dev/api/${object}`)}
          >
            Recarregar
          </Button>
        </Box>
      </Container>
    </section>
  );
}
