import pandas as pd
import plotly.graph_objects as go
import json

# Load the data from the provided JSON
data = {"insurance_market_growth": {"years": [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033], "total_market_usd_billion": [303.3, 338.0, 376.8, 420.1, 468.3, 521.8, 581.2, 647.0, 720.9, 807.9], "mobile_insurance_usd_billion": [2.1, 2.35, 2.63, 2.95, 3.31, 3.71, 4.16, 4.66, 5.23, 6.7]}}

# Extract data
years = data["insurance_market_growth"]["years"]
total_market = data["insurance_market_growth"]["total_market_usd_billion"]
mobile_insurance = data["insurance_market_growth"]["mobile_insurance_usd_billion"]

# Create the figure
fig = go.Figure()

# Add Total Insurance Market line (using first brand color)
fig.add_trace(go.Scatter(
    x=years,
    y=total_market,
    mode='lines+markers',
    name='Total Market',
    line=dict(color='#1FB8CD', width=3, shape='spline'),
    marker=dict(size=8, color='#1FB8CD'),
    cliponaxis=False,
    hovertemplate='%{x}: $%{y}b<extra></extra>'
))

# Add Mobile Phone Insurance Market line (using second brand color)
fig.add_trace(go.Scatter(
    x=years,
    y=mobile_insurance,
    mode='lines+markers',
    name='Mobile Ins.',
    line=dict(color='#FFC185', width=3, shape='spline'),
    marker=dict(size=8, color='#FFC185'),
    cliponaxis=False,
    hovertemplate='%{x}: $%{y}b<extra></extra>'
))

# Update layout
fig.update_layout(
    title="India Insurance Growth",
    xaxis_title="Year",
    yaxis_title="Market Size ($b)",
    legend=dict(
        orientation='h', 
        yanchor='bottom', 
        y=1.05, 
        xanchor='center', 
        x=0.5
    )
)

# Update axes
fig.update_xaxes(showgrid=True, gridcolor='rgba(128,128,128,0.2)')
fig.update_yaxes(showgrid=True, gridcolor='rgba(128,128,128,0.2)', tickformat='.0f')

# Save the chart
fig.write_image("india_insurance_growth.png")