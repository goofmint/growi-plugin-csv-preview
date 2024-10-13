import { parse } from '@vanillaes/csv';
import Async from 'react-async';
import './Hello.css';

const loadCSV = async({ filePath }: any, { signal }: any) => {
  const res = await fetch(filePath, { signal });
  const text = await res.text();
  return parse(text);
};

export const CSVPreview = (Tag: React.FunctionComponent<any>): React.FunctionComponent<any> => {
  return ({ children, ...props }) => {
    const { attachmentName, url }: {attachmentName: string, url: string} = props;
    if (!attachmentName.endsWith('.csv')) {
      return (<Tag {...props}>
        {children}
      </Tag>);
    }
    try {
      return (<>
        <strong>Preview: {attachmentName}</strong>
        <Async promiseFn={loadCSV} filePath={url}>
          {({ data, error, isPending }) => {
            if (isPending) return 'Loading...';
            if (error) return `Something went wrong: ${error.message}`;
            if (data) {
              return (<>
                <table className='table'>
                  <thead>
                    <tr>
                      {data[0].map((row: string) => (
                        <td>{row}</td>
                      ))}
                    </tr>
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
