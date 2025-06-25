
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  onEdit, 
  actions 
}: DataTableProps<T>) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.label}</TableHead>
              ))}
              {(onEdit || actions) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render ? column.render(item) : String(item[column.key as keyof T] || '')}
                  </TableCell>
                ))}
                {(onEdit || actions) && (
                  <TableCell>
                    <div className="flex gap-1">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      {actions && actions(item)}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default DataTable;
