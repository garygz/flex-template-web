import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureOwnListing } from '../../../util/data';
import { ListingLink } from '../../../components';
import { LISTING_STATE_DRAFT } from '../../../util/types';
import { EditListingDescriptionForm } from '../../../forms';
import config from '../../../config';

import css from './WineryEditListingDistributionPanelTab2.css';

const WineryEditListingDistributionPanelTab2 = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingDescriptionPanel.createListingTitle" />
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDescriptionForm
        className={css.form}
        initialValues={{ title, description, category: publicData.category }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { title, description, category } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: { category },
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={config.custom.categories}
      />
    </div>
  );
};

WineryEditListingDistributionPanelTab2.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

WineryEditListingDistributionPanelTab2.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default WineryEditListingDistributionPanelTab2;
