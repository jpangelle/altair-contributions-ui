import { CSVLink } from 'react-csv';

const headers = [
  { label: 'Account', key: 'account' },
  { label: 'Amount', key: 'amount' },
  { label: 'Number Of Contributions', key: 'numberOfContributions' },
];

type Props = {
  data: Contribution[];
};

export const DownloadLink = ({ data }: Props) => {
  const csvReportProps = {
    data,
    headers: headers,
    filename: 'altair-contributors.csv',
  };

  return (
    <CSVLink
      {...csvReportProps}
      style={{ fontSize: '18px', display: 'flex', alignSelf: 'center' }}
    >
      Export to CSV
    </CSVLink>
  );
};
