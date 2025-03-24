import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SocketContext, socket } from './socket';
import 'typeface-roboto';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SocketContext.Provider value={socket}>
        <MantineProvider
          theme={{
            colorScheme: 'light',
            colors: {
              primary: [
                '#ecfbfd',
                '#daf4f8',
                '#b0e8f2',
                '#85dded',
                '#66d3e9',
                '#56cde6',
                '#4ccae6',
                '#3eb2cd',
                '#2f9eb7',
                '#0d89a0',
              ],
              secondary: [
                '#f4f4f6',
                '#e6e6e6',
                '#cbcbcb',
                '#aeaeaf',
                '#959598',
                '#86868a',
                '#7d7e85',
                '#6b6c73',
                '#5e6067',
                '#25262b',
              ],
              tertiary: [
                '#edf6fb',
                '#e4e7eb',
                '#c7cdd2',
                '#a9b2ba',
                '#8e99a5',
                '#7d8b99',
                '#748493',
                '#627181',
                '#556575',
                '#445868',
              ],
              quaternary: [
                '#f5f5f5',
                '#e7e7e7',
                '#cdcdcd',
                '#b2b2b2',
                '#9a9a9a',
                '#8b8b8b',
                '#848484',
                '#717171',
                '#656565',
                '#575757',
              ],
              text1: [
                '#ecfbfd',
                '#daf4f8',
                '#b0e8f2',
                '#85dded',
                '#66d3e9',
                '#56cde6',
                '#4ccae6',
                '#3eb2cd',
                '#2f9eb7',
                '#0d89a0',
              ],
              text2: [
                '#f5f5f5',
                '#e7e7e7',
                '#cdcdcd',
                '#b2b2b2',
                '#9a9a9a',
                '#8b8b8b',
                '#848484',
                '#717171',
                '#656565',
                '#575757',
              ],
              text3: [
                '#f5f5f5',
                '#e7e7e7',
                '#cdcdcd',
                '#b2b2b2',
                '#9a9a9a',
                '#8b8b8b',
                '#848484',
                '#717171',
                '#656565',
                '#575757',
              ],
              text4: [
                '#999999',
                '#888888',
                '#777777',
                '#666666',
                '#555555',
                '#444444',
                '#333333',
                '#222222',
                '#111111',
                '#000000',
              ],
            },
            fontFamily: 'Roboto, system-ui, sans-serif',
            primaryColor: 'primary',
            components: {
              Select: {
                styles: (theme) => ({
                  item: {
                    '&[data-selected]': {
                      '&, &:hover': {
                        backgroundColor: theme.colors.primary[0],
                        color: 'inherit',
                      },
                    },
                  },
                }),
              },
              Checkbox: {
                styles: {
                  input: {
                    cursor: 'pointer',
                  },
                  labelWrapper: {
                    cursor: 'pointer',
                  },
                  label: {
                    cursor: 'pointer',
                  },
                },
              },
              Accordion: {
                styles: (theme) => ({
                  label: {
                    fontWeight: 500,
                    color: theme.colors.dark[3],
                  },
                }),
              },
            },
          }}
          withCSSVariables
        >
          <Notifications
            position="bottom-center"
            autoClose={4000}
            zIndex={5000}
          />
          {children}
        </MantineProvider>
      </SocketContext.Provider>
    </>
  );
};

export default AppProviders;
