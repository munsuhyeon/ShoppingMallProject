export default function PayButton ( { children, className, ...props} ) {
    return (
        <button className={className} {...props}>
            {children}
        </button>
    )
  }