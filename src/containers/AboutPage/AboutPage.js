import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './AboutPage.css';
import image from './grapein-landing-page.jpg';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About GrapeIn',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Experience revenue growth with GrapeIn.</h1>

          <div className={css.contentWrapper}>


            <div className={css.contentMain}>
              <p>
                Looking to market your wine in the USA? 🍷🇮🇹 + ✈️ =🍷🇺🇸 Finding the right representation for your product in the US is challenging!

                Expand your distribution by directly connecting with Importers and Distributors on GrapeIn marketplace. Registration is now open for our closed beta.
              </p>

              <p>
                You can also checkout our{' '}
                <ExternalLink href={siteFacebookPage}>Facebook</ExternalLink>

              </p>
              {/*<img className={css.coverImage} src={image} alt="My first ice cream." />*/}

            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default AboutPage;
