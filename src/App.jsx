
const initialProductList = [];

function ProductTable(props){
    const productRows = props.productList.map(product => <ProductRow key={product.id} product={product}/>);
    return(
            <table className="bordered-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {productRows}
                </tbody>
            </table>
    )
}


function ProductRow(props){
    const product = props.product;
    return(
        <tr>
            <td>{product.productName}</td>
            <td>{"$" + product.price}</td>
            <td>{product.category}</td>
            <td><a href={product.image}>view</a></td>
        </tr>
    );
}
class ProductAdd extends React.Component{
    constructor(){
        super();
        this.state = { defaultPrice: '$',
                        categoryValue: '',
                        URL: [
                            {
                              shirts: "https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609",
                              jeans: "https://www.istockphoto.com/photo/blue-jeans-isolated-with-clipping-path-gm600373506-103229995",
                              jackets: "https://www.istockphoto.com/photo/black-hoodie-mock-up-gm695933044-128721993",
                              sweaters: "https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609",
                              accessories: "https://www.shutterstock.com/image-vector/hair-accessories-woman-items-stylist-salon-1451306021"
                            }
                          ]
                    };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);      
    }
    
        
    handleSubmit(e){
        e.preventDefault();
        const form = document.forms.productAdd;
        const product = {
            productName: form.productName.value, 
            category: form.category.value,
            price: form.price.value.replace(/\$/g,""),
            image: form.image.value
            }
            
            this.props.createProduct(product);
 
            form.productName.value="";
            form.category.value="";
            this.setState({
                defaultPrice: '$',
                URL: [
                    {
                      shirts: "https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609",
                      jeans: "https://www.istockphoto.com/photo/blue-jeans-isolated-with-clipping-path-gm600373506-103229995",
                      jackets: "https://www.istockphoto.com/photo/black-hoodie-mock-up-gm695933044-128721993",
                      sweaters: "https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609",
                      accessories: "https://www.shutterstock.com/image-vector/hair-accessories-woman-items-stylist-salon-1451306021"
                    }
                  ]
              });
            
        }
    
    handleChange(e){
        this.setState( { defaultPrice: e.target.value });
    }
   
    render(){
        let btnClass = [
            'btn',
            'clearfix'
          ]
          btnClass = btnClass.join(' ');
                
        return(
            <div>
                <form name="productAdd" onSubmit={this.handleSubmit} className="form">
                    <div className="div1">
                        Category <br/>
                        <select name="category" className="selectBox"  onChange={ (e) => this.setState( { categoryValue: e.target.value }) }>
                            <option value=""></option>
                            <option value="shirts">Shirts</option>
                            <option value="jeans">Jeans</option>
                            <option value="jackets">Jackets</option>
                            <option value="sweaters">Sweaters</option>
                            <option value="accessories">Accessories</option>
                        </select><br/><br/>
                        Product Name <br/>
                        <input type="text" name="productName" /><br/><br/>
                    </div>
                    <div className="div2">
                        Price Per Unit <br/>
                        <input ref="price" type="text" name="price" onChange={ this.handleChange } value={this.state.defaultPrice} /><br/><br/>                    
                        Image URL<br/>
                        <input type="text" name="image" defaultValue={this.state.URL[0][this.state.categoryValue] || ''} /><br/><br/>
                    </div>
                    
                    <button className={btnClass}>Add Product</button>
                </form>
        </div>
        );
    }
}

class ProductList extends React.Component{
    constructor(){
        super();
        this.state = { products: []};
        this.createProduct = this.createProduct.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }
    async loadData() {
        const query = `query {
          productList {
            id productName price category image
          }
        }`;

    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query })
        });
        const result = await response.json();
        this.setState({ products: result.data.productList });
    }

    async createProduct(product) {
        const query = `mutation productAdd($product: productInput!) {
          productAdd(product: $product) {
            id
          }
        }`;

    try{
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables: { product } })
        });
        this.loadData();
    }catch(e){
        alert(`Error in sending data to server: ${e.message}`);
    }}

    render(){
        return(
            <React.Fragment>
                <h1>My Company Inventory</h1>
                <h3>Showing all available products</h3>
                <hr/>
                <ProductTable productList={this.state.products}/>
                <h3>Add a new product to the inventory</h3>
                <hr/>
                <ProductAdd createProduct={this.createProduct}/>
            </React.Fragment>
        )
    }
}
const element = <ProductList/>
ReactDOM.render(element, document.getElementById('content'));