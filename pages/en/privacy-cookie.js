import PrivacyCookiePage from '../privacy-cookie';

export default PrivacyCookiePage;

export async function getStaticProps() {
    return {
        props: {
            lang: 'en',
        },
    };
}
