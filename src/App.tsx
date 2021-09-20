import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Column } from 'react-table';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { Container, Grid, Header, Input, Loader } from 'semantic-ui-react';
import dateformat from 'dateformat';
import { DownloadLink } from './DownloadLink';
import { ContributionTable } from './ContributionTable';

const formatAmount = (value: string) => {
  const number = new BigNumber(value);
  return Number(number.dividedBy(10 ** 12).toString()).toLocaleString('en-US');
};

export const App = () => {
  const [address, setAddress] = useState('');

  const { data, isLoading, refetch } = useQuery('repoData', async () => {
    const { data } = await axios('/api/getTopContributors');
    return data;
  });

  const columns = useMemo(
    () =>
      [
        {
          accessor: 'account',
          Header: 'Address',
          Cell: props => <code>{props.value}</code>,
        },
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

  useEffect(() => {
    if (address) {
    }
  }, [address]);

  const searchAddress = useCallback(
    (value: string) =>
      data?.contributions.filter((contribution: Contribution) =>
        contribution.account.includes(value),
      ),
    [data?.contributions],
  );

  const contributions = useMemo(() => {
    if (address) {
      return searchAddress(address);
    }

    return data?.contributions;
  }, [address, data, searchAddress]);

  const lastUpdated = useMemo(
    () => dateformat(data?.timestamp, 'UTC: mmm dS, yyyy, h:MM:ss TT Z'),
    [data],
  );

  return (
    <Container style={{ paddingTop: '24px', width: '900px', height: '100%' }}>
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
            height: '300px',
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
        <div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'end',
              paddingBottom: '16px',
            }}
          >
            <Input
              spellcheck="false"
              onChange={event => setAddress(event.target.value)}
              placeholder="Search wallet address"
              style={{ width: '500px' }}
              value={address}
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ContributionTable columns={columns} data={contributions} />
          </div>
        </div>
      )}
    </Container>
  );
};
