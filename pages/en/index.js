import Home from '../index';
import { getLangContent } from '../../lib/content';

export default Home;

export async function getStaticProps() {
    const content = getLangContent('en');
    return {
        props: {
            content,
            lang: 'en'
        }
    };
}
