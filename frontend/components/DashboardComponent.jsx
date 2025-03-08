"use client";
import React from 'react'
import { Tooltip } from 'primereact/tooltip';
import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Chart } from 'primereact/chart';

/**
 * 
 * @returns 
 */
export const ColorActivator = () => {
    return (<>
        <span className="bg-green-600"></span><span className="bg-green-200"></span>
        <span className="bg-pink-600"></span><span className="bg-pink-200"></span>
        <span className="bg-yellow-600"></span><span className="bg-yellow-200"></span>
        <span className="bg-purple-600"></span><span className="bg-purple-200"></span>
        <span className="bg-red-600"></span><span className="bg-red-200"></span>
    </>);
}

export const CardStat = ({ title, subTitle = '', data, icon='folder-fill', colorTheme='blue'}) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['6 Okt 2023', '8 Okt 2023', '9 Okt 2023', '10 Okt 2023', '11 Okt 2023', '12 Okt 2023', '13 Okt 2023'],
            datasets: [
                {
                    label: 'Total Pasien',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                      borderColor: documentStyle.getPropertyValue('--blue-500'),
                      tension: 0.0
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);
    const [visible, setVisible] = useState(false);
    let colorBase = '';
    let colorLight = '';

    switch (colorTheme) {
        case 'blue':
            colorBase = 'blue-600';
            colorLight = 'blue-200'
            break;
        case 'green':
            colorBase = 'green-600';
            colorLight = 'green-200';
            break;
        case 'pink':
            colorBase = 'pink-600';
            colorLight = 'pink-200';
            break;
        case 'yellow':
            colorBase = 'yellow-600';
            colorLight = 'yellow-200';
            break;
        case 'purple':
            colorBase = 'purple-600';
            colorLight = 'purple-200';
            break;
        default:
            break;
    }

    return (
        <div className={`bg-${colorLight} rounded-2xl p-5`}>
            <div className={`w-[40px] h-[40px] rounded-full bg-${colorBase} p-1 inline-block text-center`}>
                <i className={`bi bi-${icon} text-2xl text-white`}></i>
            </div>
            <div className="mt-4">
                <span className='text-2xl font-bold text-gunmetal'>{data}</span>
            </div>
            <div className="mt-2">
                <span className='font-medium text-gunmetal'>{title}</span>
            </div>
            {subTitle && (
                <div className="mt-2">
                    <span className='text-xs text-green-500 font-medium'>{subTitle}</span>
                </div>
            )}
            <Tooltip target=".chart-cs" />
            

            <Dialog header="Grafik Pasien" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <div className="card">
                    <Chart type="line" data={chartData} options={chartOptions} />
                </div>
            </Dialog>

        </div>
    )
}


