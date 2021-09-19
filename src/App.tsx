import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Column } from 'react-table';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { Container, Grid, Header, Loader } from 'semantic-ui-react';
import dateformat from 'dateformat';
import { DownloadLink } from './DownloadLink';
import { ContributionTable } from './ContributionTable';

const formatAmount = (value: string) => {
  const number = new BigNumber(value);
  return Number(number.dividedBy(10 ** 12).toString()).toLocaleString('en-US');
};

export const App = () => {
  const { data, isLoading, refetch } = useQuery('repoData', async () => {
    const { data } = await axios('/api/getTopContributors');
    return data;
  });

  const columns = useMemo(
    () =>
      [
        { accessor: 'account', Header: 'Address' },
        {
          accessor: 'amount',
          Cell: props => (
            <div style={{ textAlign: 'center' }}>
              {formatAmount(props.value)} KSM
            </div>
          ),
          Header: () => <div style={{ textAlign: 'center' }}>Amount</div>,
        },
        {
          accessor: 'numberOfContributions',
          Cell: props => (
            <div style={{ textAlign: 'center' }}>{props.value}</div>
          ),
          Header: () => (
            <div style={{ textAlign: 'center' }}># of Contributions</div>
          ),
        },
      ] as Column<Contribution>[],
    [],
  );

  useEffect(() => {
    if (data?.contributions?.length === 0) {
      refetch();
    }
  }, [data, refetch]);

  console.log(data?.timestamp);

  const lastUpdated = useMemo(
    () => dateformat(data?.timestamp, 'UTC: mmm dS, yyyy, h:MM:ss TT Z'),
    [data],
  );

  return (
    <Container style={{ marginTop: '24px', width: '900px' }}>
      <Grid
        columns={2}
        style={{ padding: '48px 0', justifyContent: 'space-between' }}
      >
        <div>
          <Header as="h1">Altair Contributors</Header>
          {isLoading ? null : (
            <span>
              as of <strong>{lastUpdated}</strong>
            </span>
          )}
        </div>
        {isLoading ? null : <DownloadLink data={data?.contributions} />}
      </Grid>

      {isLoading ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader active inline>
            Loading
          </Loader>
        </div>
      ) : (
        <div
          style={{
            width: '900px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ContributionTable columns={columns} data={data?.contributions} />
        </div>
      )}
    </Container>
  );
};
