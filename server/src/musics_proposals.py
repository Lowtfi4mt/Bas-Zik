"""
Module for handling music proposals
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from schemas import MusicProposalSchema
from models import db, MusicProposal
from fuzzywuzzy import fuzz

musics_proposals_blp = Blueprint(
    "musics_proposals",
    __name__,
    url_prefix="/musics/proposals",
    description="Operations on music proposals",
)


@musics_proposals_blp.route("/")
class MusicProposalResource(MethodView):
    """
    Resource for proposed musics
    """

    @musics_proposals_blp.response(200, MusicProposalSchema(many=True))
    def get(self):
        """
        Get all proposed musics
        """
        return MusicProposal.query.all()

    @musics_proposals_blp.arguments(MusicProposalSchema(session=db.session))
    @musics_proposals_blp.response(201, MusicProposalSchema)
    def post(self, new_proposal):
        """
        Add a new music proposal
        """
        db.session.add(new_proposal)
        db.session.commit()
        return new_proposal


@musics_proposals_blp.route("/<int:music_id>")
class MusicProposalDetailResource(MethodView):
    """
    Resource for a specific proposed music
    """

    @musics_proposals_blp.response(200, MusicProposalSchema)
    def get(self, music_id):
        """
        Get a specific proposed music
        """
        return MusicProposal.query.get_or_404(music_id)

    @musics_proposals_blp.arguments(MusicProposalSchema(session=db.session))
    @musics_proposals_blp.response(200, MusicProposalSchema)
    def put(self, proposal, music_id):
        """
        Update a specific proposed music
        """
        proposal = MusicProposal.query.get_or_404(music_id)
        proposal.update(proposal)
        db.session.commit()
        return proposal

    @musics_proposals_blp.response(204)
    def delete(self, music_id):
        """
        Delete a specific proposed music
        """
        proposal = MusicProposal.query.get_or_404(music_id)
        db.session.delete(proposal)
        db.session.commit()
        return None


@musics_proposals_blp.route("/<int:music_id>/vote")
class MusicProposalVoteResource(MethodView):
    """
    Resource for voting on a proposed music
    """

    @musics_proposals_blp.response(204)
    def put(self, music_id):
        """
        Vote on a proposed music
        """
        proposal = MusicProposal.query.get_or_404(music_id)
        proposal.votes += 1
        db.session.commit()
        return None


@musics_proposals_blp.route("/search/<string:search>/fuzzy/<int:threshold>")
class MusicProposalSearchResource(MethodView):
    """
    Resource for searching proposed musics with a fuzzy search
    """

    @musics_proposals_blp.response(200, MusicProposalSchema(many=True))
    def get(self, search, threshold):
        """
        Search proposed musics with a fuzzy search
        """
        proposals = MusicProposal.query.all()
        return [
            proposal
            for proposal in proposals
            if fuzz.partial_ratio(search.lower(), proposal.title.lower()) >= threshold
        ]
