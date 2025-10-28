import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Box,
    Typography
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  
  export default function DataTable({ 
    columns, 
    data, 
    onEdit, 
    onDelete, 
    onView,
    emptyMessage = "No hay datos para mostrar"
  }) {
    
    const renderCellContent = (row, column) => {
      const value = row[column.field];
      
      if (column.render) {
        return column.render(row);
      }
      
      if (column.type === 'badge') {
        const color = column.getColor ? column.getColor(value) : 'default';
        return <Chip label={value} color={color} size="small" />;
      }
      
      if (column.type === 'boolean') {
        return (
          <Chip 
            label={value ? 'Sí' : 'No'} 
            color={value ? 'success' : 'default'} 
            size="small" 
          />
        );
      }
      
      return value;
    };
  
    return (
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
                  {column.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {renderCellContent(row, column)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {onView && (
                          <IconButton size="small" onClick={() => onView(row)} color="info">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        )}
                        {onEdit && (
                          <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton size="small" onClick={() => onDelete(row)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  