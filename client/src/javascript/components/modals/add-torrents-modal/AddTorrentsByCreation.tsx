import {FC, useRef, useState} from 'react';
import {useIntl} from 'react-intl';

import {Checkbox, Form, FormRow, Textbox} from '@client/ui';
import {saveAddTorrentsUserPreferences} from '@client/util/userPreferences';
import TorrentActions from '@client/actions/TorrentActions';
import UIStore from '@client/stores/UIStore';

import AddTorrentsActions from './AddTorrentsActions';
import FilesystemBrowserTextbox from '../../general/form-elements/FilesystemBrowserTextbox';
import TagSelect from '../../general/form-elements/TagSelect';
import TextboxRepeater, {getTextArray} from '../../general/form-elements/TextboxRepeater';

type AddTorrentsByCreationFormData = {
  [trackers: string]: string;
} & {
  name: string;
  sourcePath: string;
  comment: string;
  infoSource: string;
  isPrivate: boolean;
  start: boolean;
  tags: string;
};

const AddTorrentsByCreation: FC = () => {
  const formRef = useRef<Form>(null);
  const intl = useIntl();
  const [isCreatingTorrents, setIsCreatingTorrents] = useState<boolean>(false);

  return (
    <Form className="inverse" ref={formRef}>
      <FilesystemBrowserTextbox
        id="sourcePath"
        label={intl.formatMessage({
          id: 'torrents.create.source.path.label',
        })}
      />
      <TextboxRepeater
        id="trackers"
        label={intl.formatMessage({
          id: 'torrents.create.trackers.label',
        })}
        placeholder={intl.formatMessage({
          id: 'torrents.create.tracker.input.placeholder',
        })}
        defaultValues={[{id: 0, value: ''}]}
      />
      <FormRow>
        <Textbox
          id="name"
          label={intl.formatMessage({
            id: 'torrents.create.base.name.label',
          })}
          placeholder={intl.formatMessage({
            id: 'torrents.create.base.name.input.placeholder',
          })}
        />
      </FormRow>
      <FormRow>
        <Textbox
          id="comment"
          label={intl.formatMessage({
            id: 'torrents.create.comment.label',
          })}
          placeholder={intl.formatMessage({
            id: 'torrents.create.comment.input.placeholder',
          })}
        />
      </FormRow>
      <FormRow>
        <Textbox
          id="infoSource"
          label={intl.formatMessage({
            id: 'torrents.create.info.source.label',
          })}
          placeholder={intl.formatMessage({
            id: 'torrents.create.info.source.input.placeholder',
          })}
        />
      </FormRow>
      <FormRow>
        <Checkbox grow={false} id="isPrivate">
          {intl.formatMessage({id: 'torrents.create.is.private.label'})}
        </Checkbox>
      </FormRow>
      <FormRow>
        <TagSelect
          id="tags"
          label={intl.formatMessage({
            id: 'torrents.add.tags',
          })}
          placeholder={intl.formatMessage({
            id: 'torrents.create.tags.input.placeholder',
          })}
        />
      </FormRow>
      <AddTorrentsActions
        onAddTorrentsClick={() => {
          if (formRef.current == null) {
            return;
          }

          const formData = formRef.current.getFormData() as Partial<AddTorrentsByCreationFormData>;
          setIsCreatingTorrents(true);

          if (formData.sourcePath == null) {
            return;
          }

          TorrentActions.createTorrent({
            name: formData.name,
            sourcePath: formData.sourcePath,
            trackers: getTextArray(formData, 'trackers'),
            comment: formData.comment,
            infoSource: formData.infoSource,
            isPrivate: formData.isPrivate || false,
            start: formData.start || false,
            tags: formData.tags != null ? formData.tags.split(',') : undefined,
          }).then(() => {
            UIStore.dismissModal();
          });

          saveAddTorrentsUserPreferences({
            start: formData.start,
            destination: formData.sourcePath,
            tab: 'by-creation',
          });
        }}
        isAddingTorrents={isCreatingTorrents}
      />
    </Form>
  );
};

export default AddTorrentsByCreation;
