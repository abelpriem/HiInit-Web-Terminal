window.console2 = {
    log(message, type) {
        let color = 'tomato'

        if (type === 'info')
            color = 'yellowgreen'
        else if (type === 'warn')
            color = 'yellow'
        else if (type === 'error')
            color = 'orange'
        else if (type === 'fatal') {
            color = 'tomato'
        }

        console.log(`%c${message}`, `color: ${color}; font-weight: bold`)
    }
}