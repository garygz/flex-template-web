import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import routeConfiguration from '../../routeConfiguration';
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPES,
} from '../../util/urlHelpers';
import { ensureListing } from '../../util/data';
import { createResourceLocatorString } from '../../util/routes';

import WineryEditListingDescriptionPanelTab1 from './WineryEditListingTab1/WineryEditListingDescriptionPanelTab1';
import WineryEditListingDistributionPanelTab2 from './WineryEditListingTab2/WineryEditListingDistributionPanelTab2';
import WineryEditListingAttributesPanelTab3 from './WineryEditListingTab3/WineryEditListingAttributesPanelTab3';
import {
  EditListingPhotosPanel,
} from '../../components';

import css from './WineryEditListingWizard.css';

export const TAB1_WINE_DETAILS = 'wine info';
export const TAB2_DISTRIBUTION_INFO = 'distribution info';
export const TAB3_ADDITIONAL_ATTRIBUTES = 'additional wine attributes';
export const PHOTOS = "wine photos";


// EditListingWizardTab component supports these tabs
export const SUPPORTED_TABS = [
  TAB1_WINE_DETAILS,
  TAB2_DISTRIBUTION_INFO,
  TAB3_ADDITIONAL_ATTRIBUTES,
  PHOTOS,
];

const pathParamsToNextTab = (params, tab, marketplaceTabs) => {
  const nextTabIndex = marketplaceTabs.findIndex(s => s === tab) + 1;
  const nextTab =
    nextTabIndex < marketplaceTabs.length
      ? marketplaceTabs[nextTabIndex]
      : marketplaceTabs[marketplaceTabs.length - 1];
  return { ...params, tab: nextTab };
};

// When user has update draft listing, he should be redirected to next EditListingWizardTab
const redirectAfterDraftUpdate = (listingId, params, tab, marketplaceTabs, history) => {
  const currentPathParams = {
    ...params,
    type: LISTING_PAGE_PARAM_TYPE_DRAFT,
    id: listingId,
  };
  const routes = routeConfiguration();

  // Replace current "new" path to "draft" path.
  // Browser's back button should lead to editing current draft instead of creating a new one.
  if (params.type === LISTING_PAGE_PARAM_TYPE_NEW) {
    const draftURI = createResourceLocatorString('WineryEditListingPage', routes, currentPathParams, {});
    history.replace(draftURI);
  }

  // Redirect to next tab
  const nextPathParams = pathParamsToNextTab(currentPathParams, tab, marketplaceTabs);
  const to = createResourceLocatorString('WineryEditListingPage', routes, nextPathParams, {});
  history.push(to);
};

const WineryEditListingWizardTab = props => {
  const {
    tab,
    marketplaceTabs,
    params,
    errors,
    fetchInProgress,
    newListingPublished,
    history,
    images,
    availability,
    listing,
    handleCreateFlowTabScrolling,
    handlePublishListing,
    onUpdateListing,
    onCreateListingDraft,
    onImageUpload,
    onUpdateImageOrder,
    onRemoveImage,
    onChange,
    updatedTab,
    updateInProgress,
    intl,
  } = props;

  const { type } = params;
  const isNewURI = type === LISTING_PAGE_PARAM_TYPE_NEW;
  const isDraftURI = type === LISTING_PAGE_PARAM_TYPE_DRAFT;
  const isNewListingFlow = isNewURI || isDraftURI;

  const currentListing = ensureListing(listing);
  const imageIds = images => {
    return images ? images.map(img => img.imageId || img.id) : null;
  };

  const onCompleteEditListingWizardTab = (tab, updateValues) => {
    // Normalize images for API call
    const { images: updatedImages, ...otherValues } = updateValues;
    const imageProperty =
      typeof updatedImages !== 'undefined' ? { images: imageIds(updatedImages) } : {};
    const updateValuesWithImages = { ...otherValues, ...imageProperty };

    if (isNewListingFlow) {
      const onUpsertListingDraft = isNewURI
        ? (tab, updateValues) => onCreateListingDraft(updateValues)
        : onUpdateListing;

      const upsertValues = isNewURI
        ? updateValuesWithImages
        : { ...updateValuesWithImages, id: currentListing.id };

      onUpsertListingDraft(tab, upsertValues)
        .then(r => {
          if (tab !== marketplaceTabs[marketplaceTabs.length - 1]) {
            // Create listing flow: smooth scrolling polyfill to scroll to correct tab
            handleCreateFlowTabScrolling(false);

            // After successful saving of draft data, user should be redirected to next tab
            redirectAfterDraftUpdate(r.data.data.id.uuid, params, tab, marketplaceTabs, history);
          } else {
            handlePublishListing(currentListing.id);
          }
        })
        .catch(e => {
          // No need for extra actions
        });
    } else {
      onUpdateListing(tab, { ...updateValuesWithImages, id: currentListing.id });
    }
  };

  const panelProps = tab => {
    return {
      className: css.panel,
      errors,
      listing,
      onChange,
      panelUpdated: updatedTab === tab,
      updateInProgress,
    };
  };

  switch (tab) {
    case TAB1_WINE_DETAILS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'WineryEditListingWizard.saveNewDescription'
        : 'WineryEditListingWizard.saveEditDescription';
      return (
        <WineryEditListingDescriptionPanelTab1
          {...panelProps(TAB1_WINE_DETAILS)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
        />
      );
    }
    case TAB2_DISTRIBUTION_INFO: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'WineryEditListingWizard.saveNewFeatures'
        : 'WineryEditListingWizard.saveEditFeatures';
      return (
        <WineryEditListingDistributionPanelTab2
          {...panelProps(TAB2_DISTRIBUTION_INFO)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
        />
      );
    }
    case TAB3_ADDITIONAL_ATTRIBUTES: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'WineryEditListingWizard.saveNewPolicies'
        : 'WineryEditListingWizard.saveEditPolicies';
      return (
        <WineryEditListingAttributesPanelTab3
          {...panelProps(TAB3_ADDITIONAL_ATTRIBUTES)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
        />
      );
    }
    // case LOCATION: {
    //   const submitButtonTranslationKey = isNewListingFlow
    //     ? 'EditListingWizard.saveNewLocation'
    //     : 'EditListingWizard.saveEditLocation';
    //   return (
    //     <EditListingLocationPanel
    //       {...panelProps(LOCATION)}
    //       submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
    //       onSubmit={values => {
    //         onCompleteEditListingWizardTab(tab, values);
    //       }}
    //     />
    //   );
    // }
    // case PRICING: {
    //   const submitButtonTranslationKey = isNewListingFlow
    //     ? 'EditListingWizard.saveNewPricing'
    //     : 'EditListingWizard.saveEditPricing';
    //   return (
    //     <EditListingPricingPanel
    //       {...panelProps(PRICING)}
    //       submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
    //       onSubmit={values => {
    //         onCompleteEditListingWizardTab(tab, values);
    //       }}
    //     />
    //   );
    // }
    // case AVAILABILITY: {
    //   const submitButtonTranslationKey = isNewListingFlow
    //     ? 'EditListingWizard.saveNewAvailability'
    //     : 'EditListingWizard.saveEditAvailability';
    //   return (
    //     <EditListingAvailabilityPanel
    //       {...panelProps(AVAILABILITY)}
    //       availability={availability}
    //       submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
    //       onSubmit={values => {
    //         onCompleteEditListingWizardTab(tab, values);
    //       }}
    //     />
    //   );
    // }
    case PHOTOS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPhotos'
        : 'EditListingWizard.saveEditPhotos';

      // newListingPublished and fetchInProgress are flags for the last wizard tab
      return (
        <EditListingPhotosPanel
          {...panelProps(PHOTOS)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          newListingPublished={newListingPublished}
          fetchInProgress={fetchInProgress}
          images={images}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
          onUpdateImageOrder={onUpdateImageOrder}
        />
      );
    }
    default:
      return null;
  }
};

WineryEditListingWizardTab.defaultProps = {
  listing: null,
  updatedTab: null,
};

const { array, bool, func, object, oneOf, shape, string } = PropTypes;

WineryEditListingWizardTab.propTypes = {
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: oneOf(SUPPORTED_TABS).isRequired,
  }).isRequired,
  errors: shape({
    createListingDraftError: object,
    publishListingError: object,
    updateListingError: object,
    showListingsError: object,
    uploadImageError: object,
  }).isRequired,
  fetchInProgress: bool.isRequired,
  newListingPublished: bool.isRequired,
  history: shape({
    push: func.isRequired,
    replace: func.isRequired,
  }).isRequired,
  images: array.isRequired,
  availability: object.isRequired,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: shape({
    attributes: shape({
      publicData: object,
      description: string,
      geolocation: object,
      pricing: object,
      title: string,
    }),
    images: array,
  }),

  handleCreateFlowTabScrolling: func.isRequired,
  handlePublishListing: func.isRequired,
  onUpdateListing: func.isRequired,
  onCreateListingDraft: func.isRequired,
  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onRemoveImage: func.isRequired,
  onChange: func.isRequired,
  updatedTab: string,
  updateInProgress: bool.isRequired,

  intl: intlShape.isRequired,
};

export default WineryEditListingWizardTab;
