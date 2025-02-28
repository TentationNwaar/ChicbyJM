import Banner from '../../components/Banner';
import Breadcrumbs from '../../components/Breadcrumbs';
import CardController from '../../components/CardController';
import Container from '../../components/Container';
import Icon from '../../components/Icons/Icon';
import Layout from '../../components/Layout';
import LayoutOption from '../../components/LayoutOption';
import { Link } from 'gatsby';
import ProductCardGrid from '../../components/ProductCardGrid';
import Button from '../../components/Button';
import Config from '../../config.json'; 
import { graphql, useStaticQuery } from 'gatsby';

const ShopPage = (props) => {
  const data = useStaticQuery(graphql`
    query {
      allProductsCsv {
        edges {
          node {
            Handle
            Title
            Tags
            Variant_Price
            Image_Src
            Image_Position
            Image_Alt_Text
          }
        }
      }
    }
  `);

  // Liste des produits
  const products = data.allProductsCsv.edges;

  // Filtrage des produits pour ceux qui ont le tag "Femme" et une image en position 1
  const filteredProducts = products.filter(({ node }) => 
    node.Tags.split(',').map(tag => tag.trim()).includes("Femme") && node.Image_Position === "1"
  );

  // Nombre total d'articles pertinents
  const totalItems = filteredProducts.length;

  // Limit the number of items shown on mobile to 10
  const [displayedItems, setDisplayedItems] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  // Show more items when clicking the button
  const showMoreItems = () => {
    setDisplayedItems(prev => prev + 10); // Show 10 more items
  };

  // Check if the screen size is mobile
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= 430);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const visibleProducts = isMobile
    ? filteredProducts.slice(0, displayedItems)
    : filteredProducts;

  const showLoadMoreButton = isMobile && displayedItems < totalItems;

  const [showFilter, setShowFilter] = useState(false);

  // Gestion de l'événement Escape pour fermer le filtre
  const escapeHandler = (e) => {
    if (e?.keyCode === undefined) return;
    if (e.keyCode === 27) setShowFilter(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <div className={styles.breadcrumbContainer}>
          </div>
        </Container>
        <Banner
          name="Vêtements pour femmes"
          subtitle="Alliez confort et style raffiné avec nos pièces uniques, pensées pour l'univers féminin moderne."
        />
        <Container size="large" spacing="min">
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>{totalItems} produits</span>
            <div className={styles.controllerContainer}>
              <div
                className={styles.iconContainer}
                role="presentation"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Icon symbol="filter" />
                <span>Filtrer</span>
              </div>
              <div
                className={`${styles.iconContainer} ${styles.sortContainer}`}
              >
                <span>Trier par</span>
                <Icon symbol="caret" />
              </div>
            </div>
          </div>
          <CardController
            closeFilter={() => setShowFilter(false)}
            visible={showFilter}
            filters={Config.filters}
          />
          <div className={styles.chipsContainer}>
          </div>
          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>{visibleProducts.length} produits</span>
            <ProductCardGrid data={visibleProducts} />
          </div>
          <div>
          <ul className={styles.imageGrid}>
            {visibleProducts.map(({ node }) => (
              <li key={node.Handle}>
                <Link to={`/product/${node.Handle}`}>
                  <img 
                    src={node.Image_Src} 
                    alt={node.Image_Alt_Text}
                    style={{ width: '300px', height: 'auto' }}
                  />
                  <h2 style={{ fontSize: '22px' }}>{node.Title}</h2>
                  <p>{node.Variant_Price} CHF</p>
                </Link>
              </li>
            ))}
          </ul>
          </div>
          <span style={{ textAlign: 'center', display: 'block' }}>{visibleProducts.length} sur {totalItems}</span>
          {showLoadMoreButton && (
            <div className={styles.loadMoreContainer}>
              <Button fullWidth level="secondary" onClick={showMoreItems}>
                Charger plus
              </Button>
            </div>
          )}
        </Container>
      </div>
      <LayoutOption />
    </Layout>
  );
};

export default ShopPage;