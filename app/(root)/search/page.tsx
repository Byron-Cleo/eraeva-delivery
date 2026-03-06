import ProductCard from "@/components/shared/products/product-card";
import {
  getAllProducts,
  getAllCategories,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
  {
    name: "Ksh 1 to Ksh 50",
    value: "1-50"
  },
  {
    name: "Ksh 51 to Ksh 100",
    value: "51-100"
  },
  {
    name: "Ksh 101 to Ksh 200",
    value: "101-200"
  },
  {
    name: "Ksh 201 to Ksh 500",
    value: "201-500"
  },
  {
    name: "Ksh 501 to Ksh 1000",
    value: "501-1000"
  },
]

const ratings = [4,3,2,1]

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  //construct filter URL
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* FILTERS SECTION: Category Links */}
        <div className="mt-3 mb-2 text-xl">Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ c: "all" })}
                className={`${(category === "all" || category === "") && "font-bold"}`}
              >
                Any
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.category}>
                <Link
                  href={getFilterUrl({ c: cat.category })}
                  className={`${category === cat.category && "font-bold"}`}
                >
                  {cat.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* FILTERS SECTION: Price Links */}
        <div className="mt-8 mb-2 text-xl">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(price === "all") && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Any
              </Link>
            </li>
            {prices.map((pri) => (
              <li key={pri.value}>
                <Link
                  className={`${price === pri.value && "font-bold"}`}
                  href={getFilterUrl({ p: pri.value })}
                >
                  {pri.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* FILTERS SECTION: Rating Links */}
        <div className="mt-8 mb-2 text-xl">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(rating === "all") && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Any
              </Link>
            </li>
            {ratings.map((rate) => (
              <li key={rate}>
                <Link
                  className={`${rating === rate.toString() && "font-bold"}`}
                  href={getFilterUrl({ r: `${rate}` })}
                >
                  {`${rate} starts & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="md:col-span-4 spce-y-4">
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No Products Found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
