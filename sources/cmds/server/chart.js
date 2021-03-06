const Commando = require('discord.js-commando')
const { CanvasRenderService } = require('chartjs-node-canvas')
const { MessageAttachment, Message } = require('discord.js')

const data = require('@data/chart-data.json')

const members = []
const date = []

for (const item of data) {
    members.push(item.members)
    date.push(item.date)
}

const width = 800
const height = 600

const chartCallback = (ChartJS) => {
    ChartJS.plugins.register({
        beforeDraw: (chartInstance) => {
            const { chart } = chartInstance
            const { ctx } = chart
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, chart.width, chart.height)
        }
    })
}

module.exports = class ChartCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'chart',
            group: 'server',
            memberName: 'chart',
            description: 'Displays a chart'
        })
    }

    run = async message => {
        const canvas = new CanvasRenderService(
            width,
            height,
            chartCallback
        )

        const configuration = {
            type: 'bar',
            data: {
                labels: date,
                datasets: [
                    {
                        label: 'Discord Members',
                        data: members,
                        backgroundColor: '#7289d9',
                    },
                ],
            },
        }

        const image = await canvas.renderToBuffer(configuration)

        const attachment = new MessageAttachment(image)

        message.channel.send(attachment)
    }
}