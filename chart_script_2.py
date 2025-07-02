import plotly.express as px
import plotly.graph_objects as go
import json

# Data from the provided JSON
data = {
    "target_segments": {
        "urban_professionals": {"size_millions": 85, "adoption_rate": 0.15, "potential_users": 12.75},
        "college_students": {"size_millions": 45, "adoption_rate": 0.25, "potential_users": 11.25},
        "housing_societies": {"size_millions": 30, "adoption_rate": 0.20, "potential_users": 6.0},
        "office_groups": {"size_millions": 25, "adoption_rate": 0.18, "potential_users": 4.5}
    }
}

# Extract data for visualization
segments = []
potential_users = []
market_sizes = []
adoption_rates = []
legend_labels = []

segment_names = {
    "urban_professionals": "Urban Prof",
    "college_students": "College Stud", 
    "housing_societies": "Housing Soc",
    "office_groups": "Office Groups"
}

for key, value in data["target_segments"].items():
    segment_name = segment_names[key]
    segments.append(segment_name)
    potential_users.append(value["potential_users"])
    market_sizes.append(value["size_millions"])
    adoption_rates.append(value["adoption_rate"] * 100)
    # Create legend with market size and adoption rate info
    legend_labels.append(f"{segment_name}: {value['size_millions']}M mkt, {value['adoption_rate']*100:.0f}% rate")

# Bright, vibrant colors as requested
colors = ['#0080FF', '#FF6B35', '#32CD32', '#8A2BE2']  # electric blue, vibrant orange, bright green, purple

# Create pie chart with clean styling
fig = go.Figure(data=[go.Pie(
    labels=segments,
    values=potential_users,
    marker=dict(
        colors=colors,
        line=dict(color='white', width=2)
    ),
    textinfo='label+percent',
    textposition='inside',
    textfont=dict(size=12, color='white', family='Arial Black'),
    hovertemplate='<b>%{label}</b><br>' +
                  'Potential: %{value:.2f}M users<br>' +
                  'Market: %{customdata[0]}M people<br>' +
                  'Adopt Rate: %{customdata[1]:.0f}%<extra></extra>',
    customdata=list(zip(market_sizes, adoption_rates)),
    hole=0.05  # Small hole for subtle modern look
)])

# Update layout with exact title and proper spacing
fig.update_layout(
    title=dict(
        text="₹500Cr+ TAM: 35M+ Users Key Segments",
        x=0.5,
        xanchor='center',
        font=dict(size=16)
    ),
    uniformtext_minsize=12, 
    uniformtext_mode='hide',
    legend=dict(
        orientation='v',
        yanchor='middle',
        y=0.5,
        xanchor='left',
        x=1.02,
        font=dict(size=11)
    ),
    showlegend=True
)

# Add subtle shadow effect
fig.update_traces(
    marker_line_width=2,
    opacity=0.95,
    pull=[0.02, 0.02, 0.02, 0.02]  # Slight separation for modern look
)

# Save the chart
fig.write_image("pie_chart_segments.png")