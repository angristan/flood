import {Component, createRef, ReactNode, ReactNodeArray, RefObject} from 'react';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';

import {FormRow, Select, SelectItem} from '@client/ui';

import {SUPPORTED_CLIENTS} from '@shared/schema/constants/ClientConnectionSettings';

import type {ClientConnectionSettings} from '@shared/schema/ClientConnectionSettings';

import QBittorrentConnectionSettingsForm from './QBittorrentConnectionSettingsForm';
import RTorrentConnectionSettingsForm from './RTorrentConnectionSettingsForm';
import TransmissionConnectionSettingsForm from './TransmissionConnectionSettingsForm';

const DEFAULT_SELECTION: ClientConnectionSettings['client'] = 'rTorrent' as const;

const getClientSelectItems = (): ReactNodeArray =>
  SUPPORTED_CLIENTS.map((client) => (
    <SelectItem key={client} id={client}>
      <FormattedMessage id={`connection.settings.${client.toLowerCase()}`} />
    </SelectItem>
  ));

type ConnectionSettingsForm =
  | QBittorrentConnectionSettingsForm
  | RTorrentConnectionSettingsForm
  | TransmissionConnectionSettingsForm;

interface ClientConnectionSettingsFormStates {
  client: ClientConnectionSettings['client'];
}

class ClientConnectionSettingsForm extends Component<WrappedComponentProps, ClientConnectionSettingsFormStates> {
  settingsRef: RefObject<never> = createRef();

  constructor(props: WrappedComponentProps) {
    super(props);

    this.state = {
      client: DEFAULT_SELECTION,
    };
  }

  getConnectionSettings(): ClientConnectionSettings | null {
    const settingsForm = this.settingsRef as RefObject<ConnectionSettingsForm>;

    if (settingsForm.current == null) {
      return null;
    }

    return settingsForm.current.getConnectionSettings();
  }

  render() {
    const {intl} = this.props;
    const {client} = this.state;

    let settingsForm: ReactNode = null;
    switch (client) {
      case 'qBittorrent':
        settingsForm = <QBittorrentConnectionSettingsForm intl={intl} ref={this.settingsRef} />;
        break;
      case 'rTorrent':
        settingsForm = <RTorrentConnectionSettingsForm intl={intl} ref={this.settingsRef} />;
        break;
      case 'Transmission':
        settingsForm = <TransmissionConnectionSettingsForm intl={intl} ref={this.settingsRef} />;
        break;
      default:
        break;
    }

    return (
      <div>
        <FormRow>
          <Select
            id="client"
            label={intl.formatMessage({
              id: 'connection.settings.client.select',
            })}
            onSelect={(selectedClient) => {
              this.setState({
                client: selectedClient as ClientConnectionSettings['client'],
              });
            }}
            defaultID={DEFAULT_SELECTION}>
            {getClientSelectItems()}
          </Select>
        </FormRow>
        {settingsForm}
      </div>
    );
  }
}

export type ClientConnectionSettingsFormType = ClientConnectionSettingsForm;

export default injectIntl(ClientConnectionSettingsForm, {forwardRef: true});
