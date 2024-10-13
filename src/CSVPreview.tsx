import { parse } from '@vanillaes/csv';
import Async from 'react-async';
import * as XLSX from 'xlsx';
import './CSVPreview.css';

const loadCSV = async({ filePath }: any, { signal }: any) => {
  const res = await fetch(filePath, { signal });
  const text = await res.text();
  return parse(text);
};

const loadXLSX = async({ filePath }: any, { signal }: any) => {
  const file = await (await fetch(filePath, { signal })).arrayBuffer();
  const workbook = XLSX.read(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const text = XLSX.utils.sheet_to_csv(worksheet, { forceQuotes: true });
  const res = parse(text);
  return res;
};

export const CSVPreview = (Tag: React.FunctionComponent<any>): React.FunctionComponent<any> => {
  const TableView = (data: any) => {
    const bgColor = typeof document !== 'undefined'
      ? window.getComputedStyle(document.querySelector('body')!, null).getPropertyValue('background-color')
      : 'rgb(255, 255, 255)';
    return (
      <table className='table sticky-header'>
        <thead>
          {data[0].map((row: string) => (
            <th
              style={{ backgroundColor: bgColor }}
            >{row}</th>
          ))}
        </thead>
        <tbody>
          {data.slice(1).map((row: string[]) => (
            <tr>
              {row.map(str => (
                <td>{str}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return ({ children, ...props }) => {
    const { attachmentName, url }: {attachmentName: string, url: string} = props;
    if (!attachmentName.endsWith('.csv') && !attachmentName.endsWith('.xlsx')) {
      return (<Tag {...props}>
        {children}
      </Tag>);
    }
    try {
      if (attachmentName.endsWith('.csv')) {
        return (<>
          <strong>Preview: {attachmentName}</strong>
          <Async promiseFn={loadCSV} filePath={url}>
            {({ data, error, isPending }) => {
              if (isPending) return 'Loading...';
              if (error) return `Something went wrong: ${error.message}`;
              if (data) {
                return (<>
                  {TableView(data)}
                  <Tag {...props}>
                    {children}
                  </Tag>
                </>
                );
              }
              return null;
            }}
          </Async>
        </>
        );
      }
      return (<>
        <strong>Preview: {attachmentName}</strong>
        <Async promiseFn={loadXLSX} filePath={url}>
          {({ data, error, isPending }) => {
            if (isPending) return 'Loading...';
            if (error) return `<p>Something went wrong: ${error.message}</p>`;
            if (data) {
              return (<>
                {TableView(data)}
                <Tag {...props}>
                  {children}
                </Tag>
              </>
              );
            }
            return null;
          }}
        </Async>
      </>
      );

    }
    catch (err) {
      // console.error(err);
    }
    // Return the original component if an error occurs
    return (
      <Tag {...props}>{children}</Tag>
    );
  };
};
