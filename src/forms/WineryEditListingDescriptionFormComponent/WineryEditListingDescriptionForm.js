import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput } from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import VintageSelectFieldMaybe from './VintageSelectFieldMaybe';
import WineTypeSelectFieldMaybe from './WineTypeSelectFieldMaybe';

import css from './WineryEditListingDescriptionForm.css';

const TITLE_MAX_LENGTH = 60;

const WineryEditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        categories,
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
      } = fieldRenderProps;

      const vintageList = [];
      for (let i = 1960; i < (new Date()).getFullYear(); i++) {
        vintageList.push({key: i, label: i});
      }

      const wineTypeList = [
        {key: 'red', label: 'Red'},
        {key: 'white', label: 'White'},
        {key: 'sparkling', label: 'Sparkling'},
        {key: 'rose', label: 'Rose'},
        {key: 'port', label: 'Port'},
      ];

      const titleMessage = intl.formatMessage({ id: 'WineryEditListingDescriptionForm.title' });
      const titlePlaceholderMessage = intl.formatMessage({
        id: 'WineryEditListingDescriptionForm.titlePlaceholder',
      });
      const titleRequiredMessage = intl.formatMessage({
        id: 'WineryEditListingDescriptionForm.titleRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'WineryEditListingDescriptionForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const productNameMessage = intl.formatMessage({ id: 'WineryEditListingDescriptionForm.productName' });
      const productNamePlaceholderMessage = intl.formatMessage({
        id: 'WineryEditListingDescriptionForm.productNamePlaceholder',
      });

      const productNameRequiredMessage = intl.formatMessage({
        id: 'WineryEditListingDescriptionForm.productNameRequired',
      });

      const descriptionMessage = intl.formatMessage({
        id: 'WineryEditListingDescriptionForm.description',
      });
      const descriptionPlaceholderMessage = intl.formatMessage({
        id: 'WineryEditListingDescriptionForm.descriptionPlaceholder',
      });
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
      const descriptionRequiredMessage = intl.formatMessage({
        id: 'WineryEditListingDescriptionForm.descriptionRequired',
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="WineryEditListingDescriptionForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="WineryEditListingDescriptionForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="WineryEditListingDescriptionForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id="productName"
            name="productName"
            className={css.title}
            type="text"
            label={productNameMessage}
            placeholder={productNamePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(productNameRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <VintageSelectFieldMaybe
            id="vintage"
            name="vintage"
            vintageList={vintageList}
            intl={intl}
          />

          <WineTypeSelectFieldMaybe
            id="wineType"
            name="wineType"
            categories={wineTypeList}
            intl={intl}
          />

          {/*<FieldTextInput*/}
            {/*id="description"*/}
            {/*name="description"*/}
            {/*className={css.description}*/}
            {/*type="textarea"*/}
            {/*label={descriptionMessage}*/}
            {/*placeholder={descriptionPlaceholderMessage}*/}
            {/*validate={composeValidators(required(descriptionRequiredMessage))}*/}
          {/*/>*/}

          {/*<CustomCategorySelectFieldMaybe*/}
            {/*id="category"*/}
            {/*name="category"*/}
            {/*categories={categories}*/}
            {/*intl={intl}*/}
          {/*/>*/}

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

WineryEditListingDescriptionFormComponent.defaultProps = { className: null, fetchErrors: null };

WineryEditListingDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(WineryEditListingDescriptionFormComponent);
