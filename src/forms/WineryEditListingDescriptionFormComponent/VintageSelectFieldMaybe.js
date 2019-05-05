import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './WineryEditListingDescriptionForm.css';

const VintageSelectFieldMaybe = props => {
  const { name, id, vintageList, intl } = props;
  const categoryLabel = intl.formatMessage({
    id: 'WineryEditListingDescriptionForm.vintageLabel',
  });
  const categoryPlaceholder = intl.formatMessage({
    id: 'WineryEditListingDescriptionForm.vintagePlaceholder',
  });
  const categoryRequired = required(
    intl.formatMessage({
      id: 'WineryEditListingDescriptionForm.vintageRequired',
    })
  );
  return vintageList ? (
    <FieldSelect
      className={css.category}
      name={name}
      id={id}
      label={categoryLabel}
      validate={categoryRequired}
    >
      <option disabled value="">
        {categoryPlaceholder}
      </option>
      {vintageList.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default VintageSelectFieldMaybe;
