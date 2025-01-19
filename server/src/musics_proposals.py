"""
Module for handling music proposals
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from schemas import ProposedMusicSchema
from models import db, ProposedMusic

musics_proposals_blp = Blueprint(
    "musics_proposals",
    __name__,
    url_prefix="/musics/proposals",
    description="Operations on music proposals",
)


@musics_proposals_blp.route("/")
class ProposedMusicResource(MethodView):
    """
    Resource for proposed musics
    """

    @musics_proposals_blp.response(200, ProposedMusicSchema(many=True))
    def get(self):
        """
        Get all proposed musics
        """
        return ProposedMusic.query.all()

    @musics_proposals_blp.arguments(ProposedMusicSchema(session=db.session))
    @musics_proposals_blp.response(201, ProposedMusicSchema)
    def post(self, new_proposal):
        """
        Add a new music proposal
        """
        db.session.add(new_proposal)
        db.session.commit()
        return new_proposal


@musics_proposals_blp.route("/<int:music_id>")
class ProposedMusicDetailResource(MethodView):
    """
    Resource for a specific proposed music
    """

    @musics_proposals_blp.response(200, ProposedMusicSchema)
    def get(self, music_id):
        """
        Get a specific proposed music
        """
        return ProposedMusic.query.get_or_404(music_id)

    @musics_proposals_blp.arguments(ProposedMusicSchema(session=db.session))
    @musics_proposals_blp.response(200, ProposedMusicSchema)
    def put(self, proposal, music_id):
        """
        Update a specific proposed music
        """
        proposal = ProposedMusic.query.get_or_404(music_id)
        proposal.update(proposal)
        db.session.commit()
        return proposal

    @musics_proposals_blp.response(204)
    def delete(self, music_id):
        """
        Delete a specific proposed music
        """
        proposal = ProposedMusic.query.get_or_404(music_id)
        db.session.delete(proposal)
        db.session.commit()
        return None


@musics_proposals_blp.route("/<int:music_id>/vote")
class ProposedMusicVoteResource(MethodView):
    """
    Resource for voting on a proposed music
    """

    @musics_proposals_blp.response(204)
    def post(self, music_id):
        """
        Vote on a proposed music
        """
        proposal = ProposedMusic.query.get_or_404(music_id)
        proposal.votes += 1
        db.session.commit()
        return None
