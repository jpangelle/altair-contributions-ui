import { Button, Dropdown, Input } from 'semantic-ui-react';

type Props = {
  canNextPage: boolean;
  canPreviousPage: boolean;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  pageCount: number;
  pageIndex: number;
  pageOptions: number[];
  pageSize: number;
  previousPage: () => void;
  setPageSize: (size: number) => void;
};

export const Pagination = ({
  canNextPage,
  canPreviousPage,
  gotoPage,
  nextPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  previousPage,
  setPageSize,
}: Props) => (
  <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
    <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
      {'<<'}
    </Button>
    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
      {'<'}
    </Button>
    <Button onClick={() => nextPage()} disabled={!canNextPage}>
      {'>'}
    </Button>
    <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
      {'>>'}
    </Button>
    <span style={{ margin: '0 8px' }}>Page</span>
    <strong>
      {pageIndex + 1} of {pageOptions.length}
    </strong>
    <span>
      <span style={{ margin: '0 8px' }}>|</span>
      <span style={{ marginRight: '8px' }}>Go to page:</span>
      <Input
        onChange={event => {
          const page = event.target.value ? Number(event.target.value) - 1 : 0;
          gotoPage(page);
        }}
        placeholder="ex: 2"
        style={{ width: '72px' }}
      />
    </span>
    <Dropdown
      defaultValue={pageSize}
      selection
      onChange={(event: React.SyntheticEvent<HTMLElement>, { value }) => {
        setPageSize(Number(value));
      }}
      options={[
        {
          key: '10',
          text: 'Show 10',
          value: 10,
        },
        {
          key: '25',
          text: 'Show 25',
          value: 25,
        },
        {
          key: '50',
          text: 'Show 50',
          value: 50,
        },
        {
          key: '100',
          text: 'Show 100',
          value: 100,
        },
      ]}
      style={{ width: '120px', marginLeft: '8px' }}
    />
  </div>
);
