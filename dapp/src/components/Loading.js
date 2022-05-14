const Loading = ({children}) => {

    window.ethereum.on('accountsChanged', accounts => {
        // Reloading the page with the new account
        console.log("Seleccionada otra cuenta =", accounts[0]);
        window.location.reload();
    });

    return <>
        {children}
    </>
};

export default Loading;
