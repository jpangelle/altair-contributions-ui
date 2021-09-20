import { Column, usePagination, useTable } from 'react-table';
import { Icon, Table } from 'semantic-ui-react';
import { Pagination } from './Pagination';

type Props = {
  columns: Column<Contribution>[];
  data: Contribution[];
};

export const ContributionTable = ({ columns, data }: Props) => {
  const tableInstance = useTable(
    { columns, data, initialState: { pageSize: 10 } },
    usePagination,
  );

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <div style={{ width: '100%' }}>
      {data.length ? (
        <>
          <Table celled {...getTableProps()}>
            <Table.Header>
              {headerGroups.map(headerGroup => (
                <Table.Row {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <Table.HeaderCell {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <Table.Row {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <Table.Cell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Pagination
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            gotoPage={gotoPage}
            nextPage={nextPage}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            pageSize={pageSize}
            previousPage={previousPage}
            setPageSize={setPageSize}
          />
        </>
      ) : (
        <div
          style={{
            height: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '18px', marginBottom: '12px' }}>
            No Results
          </div>
          <Icon name="search" size="big" />
        </div>
      )}
    </div>
  );
};
