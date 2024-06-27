import './Button.css'

const Button = ({className, id, text, onClick, disabled, img}) => {
    if(img){
        return(<button className={className} id={id} onClick={onClick} disabled={disabled}>{img} {text}</button>)
    }else{
        return(<button className={className} id={id} onClick={onClick} disabled={disabled}> {text}</button>)
    }
}
export default Button;